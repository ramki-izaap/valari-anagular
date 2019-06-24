import {Injectable} from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  short_label?: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const VENDOR_MENUITEMS = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'icon-dashboard'
      }
    ],
  },
  {
    label: 'Sales',
    main: [
      {
        state: 'sales-order',
        short_label: 'D',
        name: 'Sales Order',
        type: 'link',
        icon: 'icon-shopping-cart'
      },
      
      // {
      //   state: 'invoices',
      //   short_label: 'I',
      //   name: 'Invoices',
      //   type: 'link',
      //   icon: 'icon-money'
      // },
      // {
      //   state: 'shipments',
      //   short_label: 'SH',
      //   name: 'Shipments',
      //   type: 'link',
      //   icon: 'icon-shift-right'
      // },
      {
        state: 'refunds',
        short_label: 'RF',
        name: 'Refunds',
        type: 'link',
        icon: 'icon-arrow-top-right'
      }
    ],
  },
  {
    label: 'Customers',
    main: [
      {
        state: 'user',
        short_label: 'UL',
        name: 'Customers',
        type: 'link',
        icon: 'icon-user'
      },
      
      // {
      //   state: 'add',
      //   short_label: 'UA',
      //   name: 'Add',
      //   type: 'link',
      //   icon: 'icon-plus'
      // }
    ],
  },
  {
    label: 'Inventory',
    main: [
      {
        state: 'vendor-products',
        short_label: 'D',
        name: 'Products',
        type: 'link',
        icon: 'icon-car'
      },
      /* {
        state: 'purchase',
        short_label: 'D',
        name: 'Purchase',
        type: 'link',
        icon: 'icon-shopping-cart'
      }, */
     
    ],
  },
  {
    label: 'Marketting',
    main: [
      // {
      //   state: 'coupons',
      //   short_label: 'CP',
      //   name: 'Coupons',
      //   type: 'sub',
      //   icon: 'icon-target',
      //    children: [
      //     {
      //       state: 'list',
      //       name: 'List'
      //     },
      //     {
      //       state: 'add',
      //       name: 'Add'
      //     }
      //   ]
      // },

      {
        state: 'coupons',
        short_label: 'CP',
        name: 'Coupons',
        type: 'link',
        icon: 'icon-target'
      },
    ],
  },

  {
    label: 'Settings',
    main: [
      // {
      //   state: 'banner',
      //   short_label: 'BR',
      //   name: 'Banner',
      //   type: 'link',
      //   icon: 'icon-blackboard'
      // },
      // {
      //   state: 'settings',
      //   short_label: 'SC',
      //   name: 'Shipping Cost',
      //   type: 'link',
      //   icon: 'icon-settings'
      // },
      {
        state: 'payment-info',
        short_label: 'SC',
        name: 'Payment Info',
        type: 'link',
        icon: 'icon-credit-card'
      }
    ],
  }
];

const MENUITEMS = [
  {
    label: 'Dashboard',
    main: [
      {
        state: 'dashboard',
        short_label: 'D',
        name: 'Dashboard',
        type: 'link',
        icon: 'icon-dashboard'
      }
    ],
  },
  {
    label: 'Vendors',
    main: [
      {
        state: 'vendors',
        short_label: 'V',
        name: 'Vendors ',
        type: 'link',
        icon: 'icon-user'
      }
    ],
  },

  // {
  //   label: 'Orders',
  //   main: [
  //     {
  //       state: 'purchase',
  //       short_label: 'P',
  //       name: 'Purchase Orders',
  //       type: 'link',
  //       icon: 'icon-shopping-cart'
  //     }
  //   ]
  // },

  {
    label: 'Inventory',
    main: [
      {
        state: 'product',
        short_label: 'P',
        name: 'Products',
        type: 'link',
        icon: 'icon-car'
        // children: [
        //   {
        //     state: 'list',
        //     name: 'List',
        //     type: 'link'
        //   },
        //   {
        //     state: 'add',
        //     name: 'Add',
        //     type: 'link'
        //   }
        // ]
      },
      {
        state: 'upload',
        short_label: 'P',
        name: 'Uploads',
        type: 'link',
        icon: 'icon-upload'
      },
      {
        state: 'category',
        short_label: 'C',
        name: 'Categories',
        type: 'link',
        icon: 'icon-tablet'
      },
      {
        state: 'variants',
        short_label: 'V',
        name: 'Variants ',
        type: 'link',
        icon: 'icon-star'
      }
    ],
  },

  // {
  //   label: 'Settings',
  //   main:
  //   [
  //     {
  //       state: 'settings',
  //       short_label: 'S',
  //       name: 'Settings ',
  //       type: 'link',
  //       icon: 'icon-settings'
  //     },
  //     {
  //       state: 'shipping-charge',
  //       short_label: 'S',
  //       name: 'Shipping Charge',
  //       type: 'link',
  //       icon: 'icon-settings'
  //     },
  //   ],
  // },

];

@Injectable()
export class MenuItems {
  getAll(): Menu[] {
    return MENUITEMS;
  }

  getAdminMenu() {
    return MENUITEMS;
  }

  getVendorMenu() {
    return VENDOR_MENUITEMS;
  }
}
