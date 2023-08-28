import * as dotenv from "dotenv";
import { TaskExecutor } from "@golem-sdk/golem-js"; // TODO: This should be exposed from top-level
import { ProposalDTO } from "@golem-sdk/golem-js/dist/market/proposal";

dotenv.config();

const acceptablePrice = async (proposal: ProposalDTO) => {
  // TODO: Too much internals leak here
  // TODO: Missing type on the usage vector, so I need to run with type casting
  const usageVector = proposal.properties["golem.com.usage.vector"] as string[];

  const counterIdx = usageVector.findIndex(
    (ele) => ele === "golem.usage.duration_sec",
  );

  const proposedCost: string =
    proposal.properties["golem.com.pricing.model.linear.coeffs"][counterIdx];

  console.debug(
    "Processing proposal",
    proposal.properties,
    proposal.properties["golem.node.id.name"],
    proposal.properties["golem.com.pricing.model.linear.coeffs"],
    proposedCost,
  );

  return true;
};

(async function main() {
  const executor = await TaskExecutor.create({
    // TODO: Hint about this in the docs
    logLevel: "debug",
    // TODO: Use a tag instead
    package: "1a0f2d0b1512018445a028c8f46151969ef8ddaaf3435ae118d3071d",

    // TODO: Check if you can get away from this
    payment: { network: "goerli" },
    yagnaOptions: { apiKey: process.env.YAGNA_APPKEY },
    proposalFilter: acceptablePrice,
  });

  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));

  try {
    // TODO: DO NOT HIDE STACK TRACES! THESE ARE DAMN IMPORTANT!!!! FIX THIS IMMEDIATELY
    await executor.run(async (ctx) => {
      console.log("Running my task");
      // TODO: Provider possibly undefined? To be addressed?
      const result = await ctx.run(
        `echo "This task is run on ${ctx.provider?.id}"`,
      );
      console.log(result.stdout, ctx.provider?.id);
    });
  } catch (err) {
    console.error("Running the task on Golem failed due to", err);
  } finally {
    await executor.end();
  }
})();
