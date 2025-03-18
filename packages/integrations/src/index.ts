import Aws from "./aws/config";
import Deel from "./deel/config";
import Azure from "./azure/config";
import Gcp from "./gcp/config";

export const integrations = [Aws, Deel, Azure, Gcp];
