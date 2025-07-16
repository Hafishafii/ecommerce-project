import xss from 'xss';

export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') return xss(input);

  if (Array.isArray(input)) return input.map(sanitizeInput);

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      sanitized[key] = sanitizeInput(input[key]);
    }
    return sanitized;
  }

  return input;
};
