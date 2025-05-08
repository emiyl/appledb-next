export function formatDateToString(date: Date, depth: number): string {
    let options: Intl.DateTimeFormatOptions;

    switch (depth) {
        case 3:
            options = { month: 'short', day: 'numeric', year: 'numeric' };
            break;
        case 2:
            options = { month: 'short', year: 'numeric' };
            break;
        case 1:
            options = { year: 'numeric' };
            break;
        default:
            throw new Error('Invalid depth value. Use 1, 2, or 3.');
    }

    return date.toLocaleDateString('en-US', options);
}