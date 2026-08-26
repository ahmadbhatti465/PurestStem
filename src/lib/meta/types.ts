export interface MetaContentItem {
  id: string;
  quantity: number;
  item_price?: number;
  title?: string;
  category?: string;
}

export interface MetaCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: MetaContentItem[];
  content_type?: "product" | "product_group";
  num_items?: number;
  order_id?: string;
  status?: string;
  search_string?: string;
  delivery_category?: string;
  [key: string]: unknown;
}

export interface MetaUserData {
  em?: string | string[]; // email (will be hashed)
  ph?: string | string[]; // phone (will be hashed)
  fn?: string | string[]; // first name (will be hashed)
  ln?: string | string[]; // last name (will be hashed)
  ct?: string | string[]; // city (will be hashed)
  st?: string | string[]; // state (will be hashed)
  zp?: string | string[]; // zip/postal code (will be hashed)
  country?: string | string[]; // country 2-letter code (will be hashed)
  external_id?: string | string[];
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  [key: string]: unknown;
}

export interface MetaCapiEventPayload {
  event_name: "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "AddPaymentInfo" | "Purchase" | string;
  event_time: number; // Unix timestamp in seconds
  event_id?: string; // For deduplication with browser Pixel
  event_source_url?: string;
  action_source: "website" | "email" | "app" | "phone_call" | "chat" | "physical_store" | "system_generated" | "other";
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
  opt_out?: boolean;
}

export interface MetaCapiBatchRequest {
  data: MetaCapiEventPayload[];
  test_event_code?: string;
}
