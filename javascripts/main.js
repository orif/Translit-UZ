// Latin to cyrillic conversion script.
// Copyright Orif Turaboyev 2011.
// Usage:
// 1. Conversion:
//      var result = t$.convert("Kvarts - bu ko`p uchraydigan minerallardan biri.");
// 2. To set apostrophes (e.g. MS Word uses different apostrophes):
//      t$.setApostrophes(['‘', '´']);

t$ = window.t$ ||
    {
        _apostrophes: ['`', '\''],
        _TSI_postFixes: ['o', 'a', 'u', 'e', 'ye', 'yo', 'yu', 'ya'],
        _TS_postFixes: ['b', 'd', 'f', 'g', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x'],
        _uzbLetters: ['ў', 'Ў', 'қ', 'Қ', 'ғ', 'Ғ', 'ҳ', 'Ҳ'],
        _inArray: function (array, elem) {
            // Taken from jQuery source.
            var r = -1;
            if (array.indexOf) {
                r = array.indexOf(elem);
            }

            for (var i = 0, length = array.length; i < length; i++) {
                if (array[i] === elem) {
                    r = i;
                    break;
                }
            }

            return r > -1;
        },
        _containsAnyOf: function (word, array) {
            if (word != null && array != null) {
                for (var i = 0, length = array.length; i < length; i++) {
                    if (word.indexOf(array[i]) > -1) {
                        return true;
                    }
                }
            }

            return false;
        },
        _isEqual: function (left, right, ignoreCase) {
            if (left == null && right == null)
                return true;

            if (left == null || right == null)
                return false;

            if (right != null) {
                if (ignoreCase)
                    return left.toLowerCase() == right.toLowerCase();

                return left == right;
            }

            return false;
        },
        getChar: function (s, i, len) {
            if (len == undefined)
                len = s.length;
            if (i < len && i > -1)
                return s[i];

            return null;
        },
        getWord: function (s, i, len) {
            if (len == undefined)
                len = s.length;
            if (i >= len || i < 0)
                return null;

            var j = i + 1;
            while (j-- > 0) {
                if (!this.isLetter(this.getChar(s, j, len)))
                    break;
            }
            var w_start = j;
            j = i - 1;
            while (++j < len) {
                if (!this.isLetter(this.getChar(s, j, len)))
                    break;
            }
            var w_end = j - 1;

            return s.substr(w_start + 1, w_end - w_start);
        },
        setApostrophes: function (apostrophes) {
            _apostrophes = apostrophes;
        },
        isApostrophe: function (c) {
            return this._inArray(this._apostrophes, c);
        },
        isLetter: function (c) {
            return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
        },
        convert: function (s) {
            if (s == null || s == undefined)
                throw new Error("argument is null");

            var r = '';

            var k = 0;
            var len = s.length;
            var n = '';
            var c = '';
            var t = true; // letter case

            while ((c = this.getChar(s, k, len))) {
                n = null;
                var lc = c.toLowerCase();
                t = (c == lc);

                if (k == len)
                    break;

                if (lc === 'a') n = 'а'
                else if (lc === 'b') n = 'б'
                else if (lc === 'd') n = 'д'
                else if (lc === 'f') n = 'ф'
                else if (lc === 'h') n = 'ҳ'
                else if (lc === 'i') n = 'и'
                else if (lc === 'j') n = 'ж'
                else if (lc === 'k') n = 'к'
                else if (lc === 'l') n = 'л'
                else if (lc === 'm') n = 'м'
                else if (lc === 'n') n = 'н'
                else if (lc === 'p') n = 'п'
                else if (lc === 'q') n = 'қ'
                else if (lc === 'r') n = 'р'
                else if (lc === 'u') n = 'у'
                else if (lc === 'v') n = 'в'
                else if (lc === 'x') n = 'х'
                else if (lc === 'z') n = 'з'
                else if (this.isApostrophe(lc)) n = 'ъ'
                else if (lc === 'c') {
                    if (this._isEqual('h', this.getChar(s, k + 1, len), true)) {
                        n = 'ч';
                        k++;
                    }
                }
                else if (lc === 's') {
                    n = 'с';
                    if (this._isEqual('h', this.getChar(s, k + 1, len), true)) {
                        n = 'ш';
                        k++;
                    } else if (this.isApostrophe(this.getChar(s, k + 1, len)) &&
                       this._isEqual('h', this.getChar(s, k + 2, len), true)) {
                        n = 'с';
                        k++;
                    }
                }
                else if (lc === 'g') {
                    n = 'г';
                    if (this.isApostrophe(this.getChar(s, k + 1, len))) {
                        n = 'ғ';
                        k++;
                    }
                }
                else if (lc === 'o') {
                    n = 'о';
                    if (this.isApostrophe(this.getChar(s, k + 1, len))) {
                        n = 'ў';
                        k++;
                    }
                }
                else if (lc === 'e') {
                    n = 'э';
                    var nc = this.getChar(s, k - 1, len);
                    if (this._isEqual('e', nc, true) &&
                this.isApostrophe(this.getChar(s, k + 1, len)))
                        n = 'э';
                    else if (nc != null) {
                        if (((nc = nc.toLowerCase()) >= 'a' && nc <= 'z') ||
                    this.isApostrophe(nc))
                            n = 'е';
                    }
                }
                else if (lc === 'y') {
                    n = 'й';
                    var nc = this.getChar(s, k + 1, len);
                    if (this._isEqual('a', nc, true)) {
                        n = 'я';
                        k++;
                    } else if (this._isEqual('e', nc, true)) {
                        n = 'е';
                        k++;
                    } else if (this._isEqual('u', nc, true)) {
                        n = 'ю';
                        k++;
                    } else if (this._isEqual('o', nc, true)) {
                        if (!this.isApostrophe(this.getChar(s, k + 2, len))) {
                            n = 'ё';
                            k++;
                        }
                    }
                }
                else if (lc === 't') {
                    n = 'т';
                    if (this._isEqual('s', this.getChar(s, k + 1, len), true)) {
                        /// Heuristic approach. Can be expanded in future.

                        // 1. if does not contain uzbek-only letters
                        // define borders {start,end} of the word
                        // check for ['ў', 'қ', 'ғ', 'ҳ']

                        var hasUzbekOnlyLetters = false;
                        var word = this.getWord(s, k, len);
                        if (word != null) {
                            var cleanedWord = word.replace('TS', ' ').replace('ts', ' ').replace('Ts', ' ').replace('tS', ' ');
                            var translated = this.convert(cleanedWord);
                            hasUzbekOnlyLetters = this._containsAnyOf(translated, this._uzbLetters);
                        }

                        if (!hasUzbekOnlyLetters) {
                            // 2. word start
                            if (!this.isLetter(this.getChar(s, k - 1, len))) {
                                n = 'ц';
                                k++;
                            }
                                // 3. word end
                            else if (!this.isLetter(this.getChar(s, k + 2, len))) {
                                n = 'ц';
                                k++;
                            }
                                // 4. contains
                                // a) 'ци-'+['о', 'а', 'е', 'э', 'у', 'ё', 'ю', 'я']
                            else if (this._isEqual('i', this.getChar(s, k + 2, len), true)) {
                                var nc = this.getChar(s, k + 3, len);
                                if (nc != null) {
                                    if (this._isEqual('y', nc, true)) {
                                        var nc2 = this.getChar(s, k + 4, len);
                                        if (nc2 != null)
                                            nc += nc2;
                                    }

                                    if (this._inArray(this._TSI_postFixes, nc)) {
                                        n = 'ц';
                                        k++;
                                    }
                                }
                            }
                                // 5. 'ts'+['b','d','f','g','j','k','l','m','n','p','r','s','t','v','x']
                            else if (this._inArray(this._TS_postFixes, this.getChar(s, k + 2, len))) {
                                n = 'ц';
                                k++;
                            }
                        }
                    }
                }

                r += (n == null ? c : (t ? n.toLowerCase() : n.toUpperCase()));
                k++;
            }

            return r;
        }
    };
