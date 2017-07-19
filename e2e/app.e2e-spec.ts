import { GuessTheWordPage } from './app.po';

describe('guess-the-word App', () => {
  let page: GuessTheWordPage;

  beforeEach(() => {
    page = new GuessTheWordPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
