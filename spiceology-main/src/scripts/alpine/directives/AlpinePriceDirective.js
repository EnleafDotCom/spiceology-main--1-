import { formatMoney } from "@shopify/theme-currency";
import Alpine from "alpinejs";

Alpine.directive("price", (el, { expression }, { evaluateLater, effect }) => {
  let getCents = evaluateLater(expression);

  effect(() => {
    getCents((cents) => {
      if (cents === null || cents === undefined) {
        el.innerHTML = "";
      } else {
        if (typeof theme === "undefined")
          el.innerHTML = formatMoney(cents, "${{amount}}");
        else
          el.innerHTML = formatMoney(
            cents,
            theme?.moneyFormat ?? "${{amount_with_comma_separator}}"
          );
      }
    });
  });
});
