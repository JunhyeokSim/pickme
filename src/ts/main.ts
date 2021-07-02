import { random } from "./util";

const rOne: number = random(10);
const rTwo: number = random(20);

console.log(`${rOne} ${rTwo}`);

function fn(s: any) {
  // No error?
  console.log(s);
}
fn(42);
