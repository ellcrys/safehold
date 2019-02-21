<template>
  <div class="welcome">
    <div class="container-fluid">
      <div class="row main-split">
        <div class="col-6">
          <div class="split-left col">
            <div class="split-center-content">
              <div class="split-header">
                <div class="split-left-nav">
                  <a class="active" href>Welcome</a>
                  <a href>Sign Up</a>
                  <a href>Create Wallet</a>
                </div>
              </div>

              <div class="split-left-main">
                <img src="../assets/img/logo-small.png">

                <h1 class="split-left-header">Welcome to Ellcrys Wallet</h1>

                <p class="split-left-subheader">Enter a strong password to get started.</p>

                <form action id="welcome-form" method novalidate>
                  <div class="form-wrapper">
                    <div class="form-element">
                      <label>Enter a password</label>
                      <input v-model="passphrase" type="password" placeholder="jasper@ellcrys.co">

                      <ul id="password-strength-bar-list">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                      </ul>

                      <em>Must be at least 8 characters</em>

                      <strong>Password too weak</strong>
                    </div>

                    <div class="form-element">
                      <button class="split-left-button" v-on:click="next" type="button">Next</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6"></div>

        <!-- <div class="split-right col">
        <div class="split-center-content">
          <div class="split-header">
            <div class="split-right-nav">
              <a href>Sign In</a>
              <a href>Security Tips</a>
            </div>
          </div>

          <div class="split-right-main">
            <div class="split-right-content">
              <img class="split-right-content-image" src="../assets/img/welcome-content-img.png">
              <p class="split-right-article">
                The Ellcrys Network is built to be censorship
                resistant. That means no one controls your account but you.
                No authority not even Ellcrys can confiscate or freeze your funds.
              </p>
            </div>

            <ul class="split-right-content-switcher-list">
              <li class="active"></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
        </div>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ipcRenderer } from 'electron';
import '../assets/css/font.css';
import '../assets/css/default.css';
import '../assets/css/form.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../assets/css/app.css';
import '../assets/css/augment.scss';
import { IGeneratedMnemonicsInfo, PASSPHRASE_STRENGTH } from '../../..';
const bip39 = require('bip39');
const scrypt = require('scrypt');
const crypto = require('crypto');
const zxcvbn = require('zxcvbn');

@Component({
	name: 'index',
})
export default class Index extends Vue {
	passphrase = '';
	passphraseErr = '';

	mounted() {
		this.onEvents();
		this.generateMnemonics('abcd');
		console.log(this.checkPasswordStrength('abcd'));
	}

	/**
	 * Listen for incoming IPC events
	 */
	onEvents() {
		// app:launched is called when the
		// application was started
		ipcRenderer.on('app:launched', (event, msg) => {
			console.log(msg);
		});
	}

	/**
	 * Generate mnemonics using a given passphras
	 * @param {string} passphrase The passphrase to use.
	 * @returns {IGeneratedMnemonicsInfo} The generated mnemonics and kdf
	 * 									  hardened passphrase
	 */
	generateMnemonics(passphrase: string): IGeneratedMnemonicsInfo {
		const bufPass = Buffer.from(passphrase, 'utf-8');

		// Harden the passphrase by passing it through
		// a KDF which returns a 32 byte seed
		const kdfPass = scrypt.hashSync(
			bufPass,
			{ N: 32768, r: 8, p: 1 },
			16,
			crypto.randomBytes(16),
		);

		// Generate mnemonics (12-words, 16-bits)
		// and send it to the back-end
		const mnemonics = bip39.entropyToMnemonic(kdfPass);
		return {
			mnemonics,
			kdfPass,
		};
	}

	/**
	 * Check the strength of a passphrase.
	 * @returns {PASSPHRASE_STRENGTH}
	 */
	checkPasswordStrength(passphrase: string): PASSPHRASE_STRENGTH {
		return zxcvbn(passphrase).score;
	}

	next() {
		if (this.passphrase.trim() === '') {
			this.passphraseErr = 'Please enter a password';
			return;
		}

		if (this.passphrase.trim().length < 6) {
			this.passphraseErr =
				'Your password is too short. Must have a minimum of 6 characters';
			return;
		}

		const mnemonicsInfo = this.generateMnemonics(this.passphrase);
		ipcRenderer.sendSync('wallet:new', mnemonicsInfo);
	}
}
</script>

<style>
</style>
