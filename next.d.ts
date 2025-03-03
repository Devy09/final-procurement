import "next";

declare module "next" {
  interface NextApiRequest {
    params: { [key: string]: string | string[] };
  }
}