import { validate, config, typedef } from "../../dist/bycontract.dev";

describe( "Enable Validation", () => {
  beforeEach(() => {
    config({ enable: false });
  });
  afterEach(() => {
    config({ enable: true });
  });
  describe( "Basic Types", () => {
    it( "throws no exception on contract violation", () => {
      var fn = () => { validate( 10, "string"); };
      expect( fn ).not.toThrow();
    });
  });
  describe( "Custom Types", () => {
      it( "throws no exception on contract violation", () => {
        typedef( "Hero", {
          hasSuperhumanStrength: "boolean",
          hasWaterbreathing: "boolean"
        });
        var superman = {
          hasSuperhumanStrength: true,
          hasWaterbreathing: 10
        };
        var fn = () => { validate( superman, "Hero" ); };
        expect( fn ).not.toThrow();
      });
  });
});
