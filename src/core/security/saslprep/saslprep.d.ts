// saslprep.d.ts

// Define interface for the options parameter
interface SaslPrepOptions {
  allowUnassigned?: boolean;
}

// Describe the function signature for saslprep
declare function saslprep(input: string, opts?: SaslPrepOptions): string;

export default saslprep;