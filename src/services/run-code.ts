import { apiKy } from "@/api";
import { z } from "zod";

const RUN_CODE_API_URL = "302/run/code";

export const RunCodeResponseSchema = z.object({
  code: z.number(),
  msg: z.string(),
  data: z.object({
    error: z.string(),
    stdout: z.string(),
  }),
});
type RunCodeResponse = z.infer<typeof RunCodeResponseSchema>;

export async function runCode({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  return await apiKy
    .post(RUN_CODE_API_URL, { json: { language, code } })
    .json<RunCodeResponse>();
}
