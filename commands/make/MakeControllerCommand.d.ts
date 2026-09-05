/**
 * Console command: `Create a new controller file`
 *
 * Registered under the `ace` CLI as `MakeControllerCommand`. See `$signature`,
 * `$options`, and `$arguments` below for its CLI shape.
 */
export default class MakeControllerCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string;
    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string;
    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>>;
    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<string>>
     */
    protected $arguments: Array<Array<string>>;
    /**
     * Executes this command.
     *
     * @param {any} options - Parsed CLI options, matching the flags declared in `$options`.
     * @param {string} args - Parsed positional CLI arguments, matching `$arguments`.
     */
    handle(options: any, args: string): Promise<void>;
}
