/**
 * Console command: `List all registered routes`
 *
 * Registered under the `ace` CLI as `RouteListCommand`. See `$signature`,
 * `$options`, and `$arguments` below for its CLI shape.
 */
export default class RouteListCommand {
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
     */
    handle(): Promise<void>;
}
