export interface ChildPriceBracket {
  label: string;
  minAge?: number;
  maxAge?: number;
  priceAmount: number;
  priceLabel?: string;
}

export interface ReservationHotelPricingInput {
  pricePerPerson?: string;
  priceAmount?: number;
  childPrice?: string;
  childPriceAmount?: number;
  childPriceBrackets?: ChildPriceBracket[];
}

export const parseNumericPrice = (value?: string): number => {
  if (!value) return 0;

  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
};

export const formatPrice = (value: number) =>
  value.toLocaleString("fr-FR").replace(/[\u202f\u00a0,]/g, " ");

export function resolveReservationPricing(
  hotel?: ReservationHotelPricingInput | null,
) {
  const adultPriceAmount =
    hotel?.priceAmount ?? parseNumericPrice(hotel?.pricePerPerson);

  return {
    adultPriceAmount,
    adultPriceLabel: hotel?.pricePerPerson || formatPrice(adultPriceAmount),
  };
}





export function calculateChildrenTotal(
  brackets: ChildPriceBracket[] | undefined,
  childAges: Record<number, number | null>,
  childCount: number,
): { childrenTotal: number; childLines: Array<{ label: string; price: number }> } {
  const childLines: Array<{ label: string; price: number }> = [];
  let childrenTotal = 0;

  for (let i = 0; i < childCount; i++) {
    const bracketIdx = childAges[i];
    if (bracketIdx != null && brackets && brackets[bracketIdx]) {
      const bracket = brackets[bracketIdx];
      childLines.push({ label: bracket.label, price: bracket.priceAmount });
      childrenTotal += bracket.priceAmount;
    }
  }

  return { childrenTotal, childLines };
}

export function calculateReservationTotal({
  adults,
  children,
  hotel,
  childAges,
}: {
  adults: number;
  children: number;
  hotel?: ReservationHotelPricingInput | null;
  childAges?: Record<number, number | null>;
}) {
  const pricing = resolveReservationPricing(hotel);
  const adultTotal = pricing.adultPriceAmount * adults;

  const { childrenTotal, childLines } = calculateChildrenTotal(
    hotel?.childPriceBrackets,
    childAges ?? {},
    children,
  );

  return {
    ...pricing,
    adultTotal,
    childrenTotal,
    childLines,
    total: adultTotal + childrenTotal,
  };
}
