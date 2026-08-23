/**
 * Console command: `Install package dependencies`
 *
 * Registered under the `ace` CLI as `InstallCommand`. See `$signature`,
 * `$options`, and `$arguments` below for its CLI shape.
 */
export default class InstallCommand {
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
     * @var $arguments Array<Array<any>>
     */
    protected $arguments: Array<Array<any>>;
    /**
     * Executes this command.
     *
     * @param options - Parsed CLI options, matching the flags declared in `$options`.
     * @param args - Parsed positional CLI arguments, matching `$arguments`.
     */
    handle(options: any, args: Array<string>): Promise<void>;
}
