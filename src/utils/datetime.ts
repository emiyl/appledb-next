export function formatDateToString(date: Date, depth: number): string | undefined {
    let options: Intl.DateTimeFormatOptions;


    switch (depth) {
        case 4:
            options = { month: 'long', day: 'numeric', year: 'numeric' };
            break;
        case 3:
            options = { month: 'short', day: 'numeric', year: 'numeric' };
            break;
        case 2:
            options = { month: 'short', year: 'numeric' };
            break;
        case 1:
            options = { year: 'numeric' };
            break;
        case 0:
            return undefined;
        default:
            throw new Error('Invalid depth value. Use 1, 2, or 3.');
    }

    return date.toLocaleDateString('en-US', options);
}