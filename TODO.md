# TODO - Fix chess AI turn problem

- [ ] Inspect current logic for turn switching, AI invocation, and UI locking.
- [x] Move AI triggering responsibility into `src/core/Game.js` after a successful WHITE move.

- [ ] Ensure `makeAIMove()` uses MinimaxAI and logs required console output (White moved, Calling AI, AI move, Turn after AI).
- [ ] Update `src/ui/InputController.js` to remove the old `setTimeout` AI call and prevent player interaction while AI is thinking/moving.
- [ ] (Optional sanity) Verify `MoveValidator` and turn rules are consistent.
- [ ] Run the app build/lint if available.

