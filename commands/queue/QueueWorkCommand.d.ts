/**
 * Console command: `Start processing jobs on the queue as a daemon`
 *
 * Registered under the `ace` CLI as `QueueWorkCommand`. See `$signature`,
 * `$options`, and `$arguments` below for its CLI shape.
 */
export default class QueueWorkCommand {
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
     * Runs as a long-lived daemon: loads the queue config (falling back to
     * the package default if the app hasn't published its own), then loops
     * indefinitely, claiming the oldest eligible job (attempts < 3, and
     * either never reserved or whose reservation is older than
     * `retry_after` seconds - i.e. presumed abandoned by a crashed worker),
     * dynamically importing and running its handler, and deleting it on
     * success or incrementing `attempts` and releasing the reservation on
     * failure. Sleeps for `retry_after` seconds whenever there's nothing
     * to claim. Listens for `exit`/`SIGINT`/`SIGTERM` to stop the loop
     * gracefully after the current iteration.
     */
    handle(): Promise<void>;
}
