export const IsPhone  = (value: string): boolean => {
  return /^1\d{10}$/.test(value)
};
export const IsEmail  = (value: string): boolean => {
  return /^\w+@[a-z0-9]+\.[a-z]+$/i.test(value)
};

