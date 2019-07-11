<script>
  import Bumbay from "./components/Bumbay.svelte";
  import { getUserBumbays, audios, sum, objectoMap, keyProxy } from "./utils";
  import { getData, putData } from "./api";
  const { 250: MAX_CRYING_SIZE } = keyProxy;
  let creditNameInput;
  let targetUser = "";
  let user = "";
  let credit = {
    user: "",
    name: "",
    price: 0
  };
  let online;
  let reactiveStorage = false;
  let bumbays = {};
  let users = {};
  $: bumbaya = Object.entries(bumbays).filter(
    ([key, value]) => !!Object.keys(value).length
  );
  $: total = sum(bumbaya, ([key, bumbay]) =>
    sum(Object.entries(bumbay), ([id, bumbayCredit]) => bumbayCredit.price)
  );
  $: bumbaysFiltered = Object.fromEntries(bumbaya);
  $: cryingSize = Math.max(16, total / 4);
  $: IYAK = total > MAX_CRYING_SIZE;
  $: if (user) {
    const filteredBumbays = localStorage.setItem(
      user,
      JSON.stringify(bumbaysFiltered)
    );
  }
  let loading = {
    save: false,
    load: false
  };
  const addCredit = async () => {
    if (!credit.name) return;
    const id = +new Date();
    bumbays[credit.user] = bumbays[credit.user] || {};
    bumbays[credit.user][id] = { id, ...credit };
    credit = {
      ...credit,
      name: "",
      price: 0
    };
    await audios.galit.play();
    if (total > MAX_CRYING_SIZE) await audios.crying.play();
  };
  const removeCredit = async (key, name = credit.name) => {
    if (!bumbays[name]) return;
    let oldBumbays = bumbays;
    delete oldBumbays[name][key];
    bumbays = oldBumbays;
    await audios.nani.play();
  };
  const onAddCredit = ({ key }) => {
    if (key !== "Enter") return;
    addCredit();
  };
  const getUsers = async () => {
    if (!user) return;
    loading.load = true;
    users = await getData();
    let storedBumbays = users[user] || {};
    bumbays = { ...bumbays, ...storedBumbays };
    await audios.punjabi.play();
    await audios.ting.play();
    loading.load = false;
  };
  const saveData = async () => {
    loading.save = true;
    users[user] = bumbaysFiltered;
    await putData(users);
    await audios.punjabi.play();
    loading.save = false;
  };
  const login = async () => {
    user = targetUser;
    bumbays = await getUserBumbays(user);
    bumbays = bumbays || {};
    await audios.punjabi.play();
    if (IYAK) await audios.crying.play();
  };
  const loginByEnter = ({ key }) => {
    if (key !== "Enter") return;
    login();
  };
</script>
<style>
  * {
    margin: 0;
    padding: 0;
    font-style: Helvetica, Arial, sans-serif;
    box-sizing: border-box;
  }
  input {
    display: block;
    margin-bottom: 10px;
    padding: 5px 10px;
    outline: 0;
  }
  button {
    border: 0;
    padding: 10px 20px;
    display: block;
    outline: 0;
    margin-bottom: 10px;
    min-width: 200px;
    cursor: pointer;
  }
</style>

<svelte:head>
  <title>💳 Pautang ng Ina - ₱{total}</title>
</svelte:head>
<svelte:body on:keyup={onAddCredit}></svelte:body>
<svelte:window bind:online></svelte:window>

{#if !user}
  <input bind:value={targetUser} placeholder="User" on:keyup={loginByEnter} />
  <button on:click={login}> Umutang na sa bumbay </button>
{:else}
  <div>
    <h3> Utang ina mo {user} </h3>
    <input bind:value={credit.user} placeholder="Bumbay mo" />
    <input bind:value={credit.name} placeholder="New Credit" bind:this={creditNameInput} />
    <input bind:value={credit.price} type="number" placeholder="New Credit" />
    <button on:click={addCredit} disabled={!credit.name}> { !credit.name ? 'Ano uutangin mo nanaman?' : 'Pautang' }</button>
    {#if online}
      <button on:click={getUsers} disabled={loading.load}> 
      {loading.load ? 'Loading payb siks...' : 'Kunin ang payb siks'}
    </button>
    <button on:click={saveData} disabled={loading.save}> 
      {loading.save ? 'Saving payb siks...' : 'Ilagay ang payb siks'} 
    </button>
    {:else}
      <h3> You are offline and can't save the data on the server </h3>
    {/if}
  </div>
  <h3> Ang utang mo ay ₱ {total} <span style="font-size: {cryingSize}px">{!total ? '😍' : IYAK ? '😢' : '😐'}</span> </h3>
  {#each bumbaya as [id, bumbay] (id)}
    <Bumbay {bumbay} on:remove={(event) => removeCredit(event.detail, id)}/>
  {/each}
  <h1> Babayaran next cut off </h1>
{/if}