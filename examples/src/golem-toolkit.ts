import { ExecutorOptionsMixin } from "@golem-sdk/golem-js/dist/executor";
import { LogLevel, ProposalFilters } from "@golem-sdk/golem-js";
import * as https from "https";

const { limitPriceFilter, whiteListProposalIdsFilter } = ProposalFilters;

/**
 * TODO: Make a lib out of this
 */
const getVerifiedProviders = async () => {
  try {
    const data = await fetch(
      // "https://provider-health.golem.network/v1/provider-whitelist",
      "http://localhost:8080/v1/provider-whitelist",
    );
    const list: string[] = await data.json();

    return list;
  } catch (err) {
    console.error("Failed to download provider whitelist, due to", err);
    throw err;
  }
};

export async function makeConfig({
  image = "golem/node:20-alpine",
}: {
  image: string;
}): Promise<ExecutorOptionsMixin> {
  const acceptablePrice = limitPriceFilter({
    start: 0.1,
    cpuPerSec: 0.1 / 3600,
    envPerSec: 0.1 / 3600,
  });

  const verifiedProviders = await getVerifiedProviders();

  const whiteList = whiteListProposalIdsFilter(verifiedProviders);

  return {
    // What do you want to run
    package: image,

    // How much you wish to spend
    budget: 0.5,
    proposalFilter: async (proposal) =>
      (await acceptablePrice(proposal)) && (await whiteList(proposal)),

    // Where you want to spend
    payment: {
      network: "polygon",
    },

    // Control the execution of tasks
    maxTaskRetries: 1,
    maxParallelTasks: 12,

    // Useful for debugging
    logLevel: LogLevel.Info,
    taskTimeout: 10 * 60 * 1000,
  };
}
