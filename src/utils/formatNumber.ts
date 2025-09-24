const formatNumberWithCommas = (number: number | null | undefined): string => {
  if (number === null || number === undefined) {
    return "";
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default formatNumberWithCommas;
