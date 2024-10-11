import Alpine from 'alpinejs'

import AlpineStore from './stores/AlpineStore'
import AlpineProductFormData from './data/AlpineProductFormData'
import AlpineSelectData from './data/AlpineSelectData'
import AlpinePriceDirective from './directives/AlpinePriceDirective'

import collapse from "@alpinejs/collapse";
import intersect from "@alpinejs/intersect";
import focus from "@alpinejs/focus";

Alpine.plugin(collapse);
Alpine.plugin(intersect);
Alpine.plugin(focus);

window.Alpine = Alpine
window.Alpine.start()
