document.addEventListener("alpine:init",(()=>{Alpine.data("cartRecommendations",(()=>({products:null,loading:!1,init(){Alpine.effect((()=>{Alpine.store("main").cart?.items,this.refresh()}))},async refresh(){let i=Alpine.store("main").cart.items.slice(0,10).map((i=>i.product_id));i=Array.from(new Set(i));const t=Math.floor(10/i.length);let e=[];try{this.loading=!0;const a=i.map((i=>fetch(`${window.Shopify.routes.root}recommendations/products.json?product_id=${i}&intent=related&limit=${t}`).then((i=>i.json()))));e=await Promise.all(a)}catch(i){console.error("Error:",i)}finally{this.loading=!1}const a=e.map((i=>i.products)).flat().filter((t=>!i.includes(t?.id))).reduce(((i,t)=>(i.some((i=>i.id===t.id))||i.push(t),i)),[]);this.products=a.map((i=>({id:i.id,title:i.title,featured_image:i.featured_image,url:i.url,active_variant_id:i.variants.find((i=>i.available))?.id,variants:i.variants.map((i=>({id:i.id,variantTitle:i.title,variantPrice:i.price,variantCompareAtPrice:i.compare_at_price,isAvailable:i.available,optionValues:i.options})))})))}})))}));