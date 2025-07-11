
import { ColorType } from "./types";

/**
 * Generates a unique identifier.
 *
 * This function creates a unique number based on the current
 * timestamp and a random value. The random value introduces
 * additional variance to ensure uniqueness even when called
 * in quick succession.
 *
 * @returns A unique numerical identifier.
 */
export const idGenerator = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};


  /**
   * Gets the next enum value in the ColorType enum.
   *
   * If the current value is the last one in the enum, wraps around to the
   * first value.
   *
   * @param current The current value.
   * @returns The next value.
   */
  export function getNextEnumValue(current: ColorType): ColorType {
    const values = Object.values(ColorType) as ColorType[];
    const index = values.indexOf(current);
    const nextIndex = (index + 1) % values.length;
    return values[nextIndex];
  };



