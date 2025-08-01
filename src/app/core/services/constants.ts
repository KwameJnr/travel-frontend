export const baseUrl = "http://internal-fib-w4ghalb-camp-int01-618444259.eu-west-1.elb.amazonaws.com/camp/travelre/"
export const baseUrlLocal = "http://localhost:9090/camp/travelre"
export const baseUrlLocalCamp = "http://localhost:9090/camp"

export function generateUUID(): string {
    return crypto.randomUUID();
  }