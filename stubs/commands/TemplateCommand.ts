export default class TemplateCommand {
    /**
     * The name and signature of the console command.
     *
     * @var $signature string
     */
    protected $signature: string = "your:command";

    /**
     * The console command description.
     *
     * @var $description string
     */
    protected $description: string = "Your command description";

    /**
     * The options or optional flag of the console command.
     *
     * @var $options Array<Array<any>>
     */
    protected $options: Array<Array<any>> = [];

    /**
     * The arguments of the console command.
     *
     * @var $arguments Array<Array<any>>
     */
    protected $arguments: Array<Array<any>> = [];

    public async handle(options: any, args: any): Promise<void> {
        // Your code goes here
    }
}