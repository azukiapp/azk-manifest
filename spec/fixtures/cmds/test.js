// import { Command } from 'azk/cli/command';
var Command = function() {};

export class TestOptions extends Command {
  action(opts) {
    this.dir(opts);
  }
}

export function init(cli) {
  (new TestOptions('test_options', cli))
    .addOption(['--number' , '-n'], { type: Number, desc: "Number description" });
}
