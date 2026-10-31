import 'package:flutter_test/flutter_test.dart';
import 'package:hot_reload_game/src/session.dart';

void main() {
  test('squashing scores, and every 15th squash earns an orb', () {
    final s = Session();
    final orbs = [for (var i = 0; i < 30; i++) s.squash()];
    expect(s.score, 30);
    expect(s.best, 30);
    expect(
      [
        for (final (i, o) in orbs.indexed)
          if (o) i + 1,
      ],
      [15, 30],
    );
  });

  test('bugs get faster and come more often as the score rises', () {
    final s = Session();
    final slow = (s.speed, s.spawnInterval);
    for (var i = 0; i < 20; i++) {
      s.squash();
    }
    expect(s.speed, greaterThan(slow.$1));
    expect(s.spawnInterval, lessThan(slow.$2));
    for (var i = 0; i < 500; i++) {
      s.squash();
    }
    expect(s.speed, 300);
    expect(s.spawnInterval, 0.35);
  });

  test('three escapes end the round, and lives never go negative', () {
    final s = Session();
    for (var i = 0; i < 5; i++) {
      s.escape();
    }
    expect(s.over, isTrue);
    expect(s.lives, 0);
  });

  test('an orb freezes the bugs for three seconds', () {
    final s = Session()..collectOrb();
    s.tick(2.9);
    expect(s.frozen, isTrue);
    s.tick(0.2);
    expect(s.frozen, isFalse);
  });

  test('reset keeps the best score', () {
    final s = Session()
      ..squash()
      ..squash()
      ..escape()
      ..reset();
    expect((s.score, s.lives, s.best), (0, Session.startLives, 2));
  });
}
