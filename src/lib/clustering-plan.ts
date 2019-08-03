import { createEmpty } from './obj-utils';

export interface Cluster
{
    data:               unknown;
    readonly length:    number;
    saving:             number;
    readonly start:     number;
}

export interface ClusteringPlan
{
    readonly clusters:      Cluster[];
    maxLength:              number;
    readonly startLinks:    StartLinks;
    addCluster(start: number, length: number, data: unknown, saving: number): void;
    conclude(): readonly Cluster[];
}

interface StartLinks { [key: number]: Cluster[]; }

function addCluster
(this: ClusteringPlan, start: number, length: number, data: unknown, saving: number): void
{
    const startLink = getOrCreateStartLink(this.startLinks, start);
    let cluster = startLink[length];
    if (cluster)
    {
        if (cluster.saving < saving)
        {
            cluster.data    = data;
            cluster.saving  = saving;
        }
    }
    else
    {
        cluster = startLink[length] = { start, length, data, saving };
        this.clusters.push(cluster);
    }
    if (this.maxLength < length)
        this.maxLength = length;
}

function compareClustersByQuality(cluster1: Cluster, cluster2: Cluster): number
{
    const diff =
    cluster1.saving - cluster2.saving ||
    cluster2.length - cluster1.length ||
    compareClustersByStart(cluster2, cluster1);
    return diff;
}

function compareClustersByStart(cluster1: Cluster, cluster2: Cluster): number
{
    const diff = cluster2.start - cluster1.start;
    return diff;
}

function conclude(this: ClusteringPlan): readonly Cluster[]
{
    const clusters = this.clusters.sort(compareClustersByQuality);
    const { maxLength, startLinks } = this;
    const bestClusters: Cluster[] = [];
    let cluster: Cluster | undefined;
    while (cluster = pickBestCluster(startLinks, clusters, maxLength))
        bestClusters.push(cluster);
    bestClusters.sort(compareClustersByStart);
    return bestClusters;
}

function getOrCreateStartLink(startLinks: StartLinks, start: number): Cluster[]
{
    const startLink = startLinks[start] || (startLinks[start] = []);
    return startLink;
}

function pickBestCluster
(startLinks: StartLinks, clusters: Cluster[], maxLength: number): Cluster | undefined
{
    let cluster: Cluster | undefined;
    while (cluster = clusters.pop())
    {
        if (cluster.saving != null)
        {
            unlinkClusters(startLinks, maxLength, cluster);
            return cluster;
        }
    }
}

function unlinkClusters(startLinks: StartLinks, maxLength: number, cluster: Cluster): void
{
    let startLink;
    const { start } = cluster;
    let index = start;
    const end = start + cluster.length;
    do
    {
        startLink = startLinks[index];
        if (startLink)
        {
            unlinkClustersFromLength(startLink, 0);
            delete startLinks[index];
        }
    }
    while (++index < end);
    for (let length = 1; length < maxLength;)
    {
        startLink = startLinks[start - length++];
        if (startLink)
        {
            unlinkClustersFromLength(startLink, length);
            startLink.length = length;
        }
    }
}

function unlinkClustersFromLength(startLink: readonly Cluster[], fromLength: number): void
{
    for (let { length } = startLink; length-- > fromLength;)
    {
        const cluster = startLink[length];
        if (cluster)
            delete cluster.saving;
    }
}

export default function createClusteringPlan(): ClusteringPlan
{
    const plan: ClusteringPlan =
    {
        addCluster,
        clusters:   [],
        conclude,
        maxLength:  0,
        startLinks: createEmpty(),
    };
    return plan;
}
