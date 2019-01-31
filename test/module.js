export default [
  { 
    name: 'homePage',
    url: "/pages/index/main",
    before(){}, 
  },
  { 
    name: 'cartPage',
    url: "/pages/cart/main", 
    before(){}, 
  },
  { 
    name: 'centerPage',
    url: "/pages/cart/main", 
    authorize: true, 
    before(){}, 
  },
  {
    name: 'loginPage',
    url: "/pages/cart/main",
    before(){}, 
  },
]
