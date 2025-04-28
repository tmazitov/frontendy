export default interface Form {
    validate(): string | undefined;
    toSubmit(): Record<string, any>;
}