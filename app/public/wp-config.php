<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '>!Fh;/4En=$`!4jV|?s;!ynbWrWLv9)HB{WUhWvFpE]yzzk/,n^.Gl-c-l_;|:d0' );
define( 'SECURE_AUTH_KEY',   ')G=~_0F8eBG^[]45L|og;xnRy}-+h{ryp(G4]j++A?Cfy^?(!p2jO3#Ns)D0l,2)' );
define( 'LOGGED_IN_KEY',     '$#O9EX7i(vD-!>I/kA!/4WVDkipuI(tz$-d<?f]: _Cz7I=0A+o6e;UUrn8R2}ZN' );
define( 'NONCE_KEY',         '}]Ws1p@lmB-;=[X6n{8T0)N-7D3GpN<r}l$_}TESFw>1+o-a%`]Tj&9o)7s8c?Mr' );
define( 'AUTH_SALT',         'TZ=+UiFpo:ms3*/1{P(yHCR|Ylb~k2>N/1<R^UETl}pYXeS.)/KS.Y6Pu+JjpsvV' );
define( 'SECURE_AUTH_SALT',  'eAWZ{NbYJg3PhBh}i_QpYxemdRW3<Ya)v[Mh^hf]H)*6$Ov~{ECy*r}zsK;Sy6kI' );
define( 'LOGGED_IN_SALT',    ':MxE%[%LJ=_0=!yS8o>0)gcf,n2w*9Yj nfU2dJYnS/0(VP9G,f97fSN64w/s@DA' );
define( 'NONCE_SALT',        'NHfu;fCWu[^wkJGn)+z8LN+hLb<>O M`@%RHEAtsy+E&@[+@bIWhnO+fEUCh+^vL' );
define( 'WP_CACHE_KEY_SALT', 'q7a(VM4QDCdMS|6M6GS<a.wI}U9A!d[sm%!Y=7WC}D>/7znDEZQcG}z;:Z0QV/!|' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
