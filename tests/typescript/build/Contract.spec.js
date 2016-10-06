"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var byContract_1 = require("../../byContract");
var expect = chai.expect;
describe("Basic Type Validation", function () {
    describe("{string}", function () {
        it("doesn't throw when byContract( \"string\", \"String\" )", function () {
            var fn = function () { byContract_1.byContract("string", "String"); };
            expect(fn).to.not.throw(Error);
        });
        it("doesn't throw when byContract( \"string\", \"string\" )", function () {
            var fn = function () { byContract_1.byContract("string", "string"); };
            expect(fn).to.not.throw(Error);
        });
        it("doesn't throw when byContract( [ \"string\" ], [ \"string\" ] )", function () {
            var fn = function () { byContract_1.byContract(["string"], ["string"]); };
            expect(fn).to.not.throw(Error);
        });
        it("throws when when incorrect", function () {
            [1, [], {}, /preg/, undefined, true, null, function () { }, NaN].forEach(function (val) {
                var fn = function () { byContract_1.byContract(val, "string"); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
    describe("{number}", function () {
        it("doesn't throw when correct", function () {
            var fn = function () { byContract_1.byContract(1, "number"); };
            expect(fn).to.not.throw(byContract_1.Exception);
        });
        it("throws when when incorrect", function () {
            ["string", [], {}, /preg/, undefined, true, null, function () { }, NaN].forEach(function (val) {
                var fn = function () { byContract_1.byContract(val, "number"); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
    describe("{array}", function () {
        it("doesn't throw when correct", function () {
            var fn = function () { byContract_1.byContract([], "array"); };
            expect(fn).to.not.throw(byContract_1.Exception);
        });
        it("throws when when incorrect", function () {
            ["string", 1, {}, /preg/, undefined, true, null, function () { }, NaN].forEach(function (val) {
                var fn = function () { byContract_1.byContract(val, "array"); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
    describe("{undefined}", function () {
        it("doesn't throw when correct", function () {
            var fn = function () { byContract_1.byContract(undefined, "undefined"); };
            expect(fn).to.not.throw(byContract_1.Exception);
        });
        it("throws when when incorrect", function () {
            ["string", 1, {}, /preg/, [], true, null, function () { }, NaN].forEach(function (val) {
                var fn = function () { byContract_1.byContract(val, "undefined"); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
    describe("{boolean}", function () {
        it("doesn't throw when correct", function () {
            var fn = function () { byContract_1.byContract(false, "boolean"); };
            expect(fn).to.not.throw(byContract_1.Exception);
        });
        it("throws when when incorrect", function () {
            ["string", [], {}, /preg/, undefined, 1, null, function () { }, NaN].forEach(function (val) {
                var fn = function () { byContract_1.byContract(val, "boolean"); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
    describe("{function}", function () {
        it("doesn't throw when correct", function () {
            var fn = function () { byContract_1.byContract(function () { }, "function"); };
            expect(fn).to.not.throw(byContract_1.Exception);
        });
        it("throws when when incorrect", function () {
            ["string", [], {}, /preg/, undefined, true, null, 1, NaN].forEach(function (val) {
                var fn = function () { byContract_1.byContract(val, "function"); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
    describe("{nan}", function () {
        it("doesn't throw when correct", function () {
            var fn = function () { byContract_1.byContract(NaN, "nan"); };
            expect(fn).to.not.throw(byContract_1.Exception);
        });
        it("throws when when incorrect", function () {
            ["string", [], {}, /preg/, undefined, true, null, function () { }, 1].forEach(function (val) {
                var fn = function () { byContract_1.byContract(val, "nan"); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
    describe("{null}", function () {
        it("doesn't throw when correct", function () {
            var fn = function () { byContract_1.byContract(null, "null"); };
            expect(fn).to.not.throw(byContract_1.Exception);
        });
        it("throws when when incorrect", function () {
            ["string", [], {}, /preg/, undefined, true, 1, function () { }, NaN].forEach(function (val) {
                var fn = function () { byContract_1.byContract(val, "null"); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
    describe("{object}", function () {
        it("doesn't throw when correct", function () {
            var fn = function () { byContract_1.byContract({}, "object"); };
            expect(fn).to.not.throw(byContract_1.Exception);
        });
        it("throws when when incorrect", function () {
            ["string", 1].forEach(function (val) {
                var fn = function () { byContract_1.byContract(val, "object"); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
    describe("{regexp}", function () {
        it("doesn't throw when correct", function () {
            var fn = function () { byContract_1.byContract(/regexp/, "regexp"); };
            expect(fn).to.not.throw(byContract_1.Exception);
        });
        it("throws when when incorrect", function () {
            ["string", [], {}, 1, undefined, true, null, function () { }, NaN].forEach(function (val) {
                var fn = function () { byContract_1.byContract(val, "regexp"); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
});
describe("@Input", function () {
    describe("{string}", function () {
        it("doesn't throw when byContract( \"string\", \"String\" )", function () {
            var Fixture = (function () {
                function Fixture() {
                }
                Fixture.prototype.test = function (arg) { };
                __decorate([
                    byContract_1.Input(["String"]), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], Fixture.prototype, "test", null);
                return Fixture;
            }());
            var fn = function () { (new Fixture()).test("string"); };
            expect(fn).to.not.throw(Error);
        });
        it("throws when when incorrect", function () {
            var Fixture = (function () {
                function Fixture() {
                }
                Fixture.prototype.test = function (arg) { };
                __decorate([
                    byContract_1.Input(["string"]), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], Fixture.prototype, "test", null);
                return Fixture;
            }());
            [1, [], {}, /preg/, undefined, true, null, function () { }, NaN].forEach(function (val) {
                var fn = function () { (new Fixture()).test(val); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
        it("doesn't lose the return value", function () {
            var Fixture = (function () {
                function Fixture() {
                }
                Fixture.prototype.test = function (arg) { return arg; };
                __decorate([
                    byContract_1.Input(["String"]), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], Fixture.prototype, "test", null);
                return Fixture;
            }());
            expect((new Fixture()).test("string")).to.eql("string");
        });
        it("doesn't lose the context", function () {
            var Fixture = (function () {
                function Fixture() {
                    this.quiz = "quiz";
                }
                Fixture.prototype.baz = function () { return "baz"; };
                Fixture.prototype.test = function (arg) { return this.baz(); };
                __decorate([
                    byContract_1.Input(["String"]), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], Fixture.prototype, "test", null);
                return Fixture;
            }());
            var fix = new Fixture();
            expect(fix.test("string")).to.eql("baz");
            expect(fix.quiz).to.eql("quiz");
        });
    });
});
describe("@Input <static>", function () {
    describe("{string}", function () {
        it("doesn't throw when byContract( \"string\", \"String\" )", function () {
            var Fixture = (function () {
                function Fixture() {
                }
                Fixture.test = function (arg) { };
                __decorate([
                    byContract_1.Input(["String"]), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], Fixture, "test", null);
                return Fixture;
            }());
            var fn = function () { };
            expect(fn).to.not.throw(Error);
        });
        it("throws when when incorrect", function () {
            var Fixture = (function () {
                function Fixture() {
                }
                Fixture.test = function (arg) { };
                __decorate([
                    byContract_1.Input(["string"]), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], Fixture, "test", null);
                return Fixture;
            }());
            [1, [], {}, /preg/, undefined, true, null, function () { }, NaN].forEach(function (val) {
                var fn = function () { Fixture.test(val); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
});
describe("@Output", function () {
    describe("{string}", function () {
        it("doesn't throw when byContract( \"string\", \"String\" )", function () {
            var Fixture = (function () {
                function Fixture() {
                }
                Fixture.prototype.test = function () { return "string"; };
                __decorate([
                    byContract_1.Output("String"), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', void 0)
                ], Fixture.prototype, "test", null);
                return Fixture;
            }());
            var fn = function () { (new Fixture()).test(); };
            expect(fn).to.not.throw(Error);
        });
        it("throws when when incorrect", function () {
            var Fixture = (function () {
                function Fixture() {
                }
                Fixture.prototype.test = function () { return; };
                __decorate([
                    byContract_1.Output("string"), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', []), 
                    __metadata('design:returntype', void 0)
                ], Fixture.prototype, "test", null);
                return Fixture;
            }());
            [1, [], {}, /preg/, undefined, true, null, function () { }, NaN].forEach(function (val) {
                var fn = function () { (new Fixture()).test(); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
});
describe("@Input + @Output", function () {
    describe("{string}", function () {
        it("doesn't throw when byContract( \"string\", \"String\" )", function () {
            var Fixture = (function () {
                function Fixture() {
                }
                Fixture.prototype.test = function (arg) { return arg; };
                __decorate([
                    byContract_1.Input(["String"]),
                    byContract_1.Output("String"), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], Fixture.prototype, "test", null);
                return Fixture;
            }());
            var fn = function () { (new Fixture()).test("string"); };
            expect(fn).to.not.throw(Error);
        });
        it("throws when when incorrect", function () {
            var Fixture = (function () {
                function Fixture() {
                }
                Fixture.prototype.test = function (arg) { return arg; };
                __decorate([
                    byContract_1.Input(["String"]),
                    byContract_1.Output("String"), 
                    __metadata('design:type', Function), 
                    __metadata('design:paramtypes', [Object]), 
                    __metadata('design:returntype', void 0)
                ], Fixture.prototype, "test", null);
                return Fixture;
            }());
            [1, [], {}, /preg/, undefined, true, null, function () { }, NaN].forEach(function (val) {
                var fn = function () { (new Fixture()).test(val); };
                expect(fn).to.throw(byContract_1.Exception, /violates the contract/);
            });
        });
    });
});
