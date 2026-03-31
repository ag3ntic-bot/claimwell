import { useDraftStore } from '../draft.store';

describe('useDraftStore', () => {
  beforeEach(() => {
    useDraftStore.getState().resetDraft();
  });

  it('has initial tone of "assertive"', () => {
    expect(useDraftStore.getState().selectedTone).toBe('assertive');
  });

  it('has initial isEditing as false', () => {
    expect(useDraftStore.getState().isEditing).toBe(false);
  });

  it('has initial empty draftContent', () => {
    expect(useDraftStore.getState().draftContent).toBe('');
  });

  it('setTone changes the selected tone', () => {
    useDraftStore.getState().setTone('calm');
    expect(useDraftStore.getState().selectedTone).toBe('calm');
  });

  it('setTone changes to formal', () => {
    useDraftStore.getState().setTone('formal');
    expect(useDraftStore.getState().selectedTone).toBe('formal');
  });

  it('setEditing updates isEditing', () => {
    useDraftStore.getState().setEditing(true);
    expect(useDraftStore.getState().isEditing).toBe(true);
  });

  it('setContent updates draftContent', () => {
    useDraftStore.getState().setContent('Dear Apple Customer Relations...');
    expect(useDraftStore.getState().draftContent).toBe('Dear Apple Customer Relations...');
  });

  it('resetDraft returns all values to defaults', () => {
    useDraftStore.getState().setTone('formal');
    useDraftStore.getState().setEditing(true);
    useDraftStore.getState().setContent('Some draft content');

    useDraftStore.getState().resetDraft();

    const state = useDraftStore.getState();
    expect(state.selectedTone).toBe('assertive');
    expect(state.isEditing).toBe(false);
    expect(state.draftContent).toBe('');
  });
});
