import byContract from "../../dist/dev";

describe( "isEnabled Validation", () => {
  beforeEach(() => {
    byContract.isEnabled = false;
  });
  afterEach(() => {
    byContract.isEnabled = true;
  });
  describe( "Basic Types", () => {
    it( "throws no exception on contract violation", () => {
      var fn = () => { byContract( 10, "string"); };
      expect( fn ).not.toThrow();
    });
  });
  describe( "Custom Types", () => {
      it( "throws no exception on contract violation", () => {
        byContract.typedef( "Hero", {
          hasSuperhumanStrength: "boolean",
          hasWaterbreathing: "boolean"
        });
        var superman = {
          hasSuperhumanStrength: true,
          hasWaterbreathing: 10
        };
        var fn = () => { byContract( superman, "Hero" ); };
        expect( fn ).not.toThrow();
      });
  });
});
