const debounce = (func: Function, delay: number) => {
  let timer: number;
  return function (...args: Array<any>) {
    clearTimeout(timer);
    timer = setTimeout(func.apply(null, args), delay);
  };
};

export default debounce;
