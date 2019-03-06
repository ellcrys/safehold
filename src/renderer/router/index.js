import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
	routes: [{
			path: '/',
			name: 'index',
			component: require('@/components/Index').default,
		},
		{
			path: '/login',
			name: 'login',
			component: require('@/components/Login').default,
		},
		{
			path: '/save-seed-words',
			name: 'save-seed-words',
			component: require('@/components/SaveMnemonics').default,
		},
		{
			path: '/verify-seed-words',
			name: 'verify-seed-words',
			component: require('@/components/VerifyMnemonics').default,
		},
		{
			path: '/restore-wallet',
			name: 'restore-wallet',
			component: require('@/components/restore-wallet/RestoreWallet').default,
		},
		{
			path: '/set-passphrase',
			name: 'set-passphrase',
			component: require('@/components/restore-wallet/SetPassphrase').default,
			props: true,
		},
		{
			path: '/dashboard',
			name: 'dashboard',
			component: require('@/components/dashboard/Dashboard').default,
			props: true,
			children: [{
				path: "/index",
				name: "index",
				component: require('@/components/dashboard/OverviewView').default
			}, {
				path: "/miner",
				name: "miner",
				component: require('@/components/dashboard/MinerView').default
			}, {
				path: "/account",
				name: "account",
				component: require('@/components/dashboard/AccountView').default
			}]
		},

	],
});
