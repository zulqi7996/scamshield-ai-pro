# Manual testing checklist

- [ ] Page displays gradient hero, colored shield and designed cards
- [ ] Mobile width 375px has no horizontal overflow
- [ ] Message tab takes input and produces findings
- [ ] Link tab accepts valid HTTPS URL and reports indicators
- [ ] Empty content does not give a fake score
- [ ] Suspicious brand imitation URL triggers warnings
- [ ] A low score clearly does not imply the URL is safe
- [ ] Copy report works with clipboard permission
- [ ] Download creates `scamshield-report.txt`
- [ ] Sample and Clear buttons work
- [ ] No browser console errors
- [ ] CSS and JS return HTTP 200 on deployed site
- [ ] Planned plan buttons cannot collect payments

Test with both false positives and false negatives. Heuristic scores have not been scientifically calibrated.
