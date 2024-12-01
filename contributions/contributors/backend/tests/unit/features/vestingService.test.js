const {
    addVestingSchedule,
    calculateUnlockedTokens,
    claimTokens,
    getVestingStatus,
  } = require("../../tasks/features/vestingService");
  const moment = require("moment");
  
  describe("Vesting Service", () => {
    beforeAll(() => {
      addVestingSchedule("0xTestAddress", 1000, [
        { timestamp: moment().subtract(1, "days").unix(), percentage: 50 },
        { timestamp: moment().add(1, "days").unix(), percentage: 50 },
      ]);
    });
  
    it("should calculate unlocked tokens correctly", () => {
      const unlockedTokens = calculateUnlockedTokens("0xTestAddress");
      expect(unlockedTokens).toBe(500);
    });
  
    it("should claim tokens successfully", () => {
      const claimed = claimTokens("0xTestAddress");
      expect(claimed).toBe(500);
    });
  
    it("should fetch the vesting status correctly", () => {
      const status = getVestingStatus("0xTestAddress");
      expect(status).toEqual({
        totalTokens: 1000,
        claimedTokens: 500,
        unlockedTokens: 500,
        remainingTokens: 0,
      });
    });
  });
  