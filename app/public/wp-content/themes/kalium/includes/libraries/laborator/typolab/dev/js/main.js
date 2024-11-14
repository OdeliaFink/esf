import $ from "./var/jquery";
import "./misc";
import "./page/add-font-page";
import "./page/fonts-list-page";
import "./page/edit-font-page";
import "./page/font-sizes-page";
import "./page/font-settings-page";
import TypoLab from "./typolab";

/**
 * Initialize TypoLab.
 */
$( document ).ready( function () {
	window.typolab = new TypoLab();
} );
