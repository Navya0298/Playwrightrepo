export function getRandomInt(min: number, max: number): number {
  /**
   * This helper function to get random integer in specific range.
   * Usage: getRandomInt(1, 4);
   * 
   * Please use test scenarios as a reference.
   */
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getFutureDate(days: number): string {
  /**
   * This helper function  to return future date in format MM/DD/YYYY.
   * Usage: getFutureDate(90);
   * 
   * Please use test scenarious as a reference.
   */
    var futureDate = new Date();
    days = Math.ceil(days);
    futureDate.setDate(futureDate.getDate() + days);
    return `${futureDate.getMonth() + 1}/${futureDate.getDate()}/${futureDate.getFullYear()}`;
}

export function getRegion(): string {
  /**
   * This helper function returns Region based on provider parameter to playwright script.
   * Usage: getRegion();
   * 
   * Please use README file as a reference.
   */

  const region = process.env.REGION;

  if ( region === undefined )
    {
      return '2'; // by default we will return Region 2
    }

  const regionInt = parseInt(region, 10);

  if (regionInt === 3) // Production for CCA, skip
  {
    return '2';
  }

  if ( regionInt <= 1 && regionInt > 4 )
    {
      return '2'; // not in a range we will return Region 2
    } else {
      return `${regionInt}`; // return target Region
    }
}
