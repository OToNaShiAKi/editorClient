import Vue from "vue";
import Codemirror from "vue-codemirror";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/abcdef.css";

import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/vue/vue.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/php/php.js";
import "codemirror/mode/clike/clike.js";

Vue.use(Codemirror, {
  options: {
    theme: "abcdef",
    lineNumbers: true,
  },
});
