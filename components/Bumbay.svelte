<script>
  import { createEventDispatcher } from "svelte";

  import Credit from "./Credit.svelte";
  export let bumbay;
  $: credits = Object.values(bumbay);

  const dispatch = createEventDispatcher();

  const remove = id => () => dispatch("remove", id);
</script>

<div class="credits">
  {#each credits as credit (credit.id)}
    <Credit {credit} on:click={remove(credit.id)} />
  {/each}
</div>
