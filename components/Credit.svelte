<script>
  import { formatDate } from "../utils";
  export let credit;
  let size = credit.price;
</script>

<div class="credit">
  <span on:click style="cursor: pointer;"> ❌ </span>
  {credit.name} | ₱{credit.price} 💳 | 
  <span style="font-size: {size}px">😡</span> {credit.user}
  Created at: {formatDate(new Date(credit.id), 'h:i:s m/d/y')}
</div>