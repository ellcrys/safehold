<template>
  <div>
    <ConfirmCopy/>
    <ReceiveTxn/>
    <SendTxn/>
    <ReceiveAddress/>
  </div>
</template>

<script lang="ts">
import ConfirmCopy from './ConfirmCopy.vue';
import ReceiveTxn from './ReceiveTxn.vue';
import SendTxn from './SendTxn.vue';
import ReceiveAddress from './ReceiveAddress.vue';

export default {
	components: {
		ConfirmCopy,
		ReceiveTxn,
		SendTxn,
		ReceiveAddress,
	},

	data() {
		return {};
	},
};
</script>
