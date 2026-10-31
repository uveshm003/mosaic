import 'dart:math';

import 'package:demo_kit/demo_kit.dart';
import 'package:flame/components.dart';
import 'package:flame/events.dart';
import 'package:flame/particles.dart';
import 'package:flutter/material.dart';

import 'game.dart';
import 'session.dart';

/// A bug crawling toward the build. Tap it to squash it.
class Bug extends PositionComponent
    with TapCallbacks, HasGameReference<HotReloadGame> {
  Bug({required super.position, required this.phase})
    : super(size: Vector2(34, 40), anchor: Anchor.center);

  /// Offsets the wiggle so bugs don't move in step.
  final double phase;
  var _time = 0.0;

  static final _body = Paint()..color = DemoColors.coral;
  static final _shell = Paint()..color = const Color(0xFFE0603D);
  static final _legs = Paint()
    ..color = DemoColors.coral
    ..strokeWidth = 2
    ..strokeCap = StrokeCap.round;

  @override
  void update(double dt) {
    if (game.session.frozen) return;
    _time += dt;
    // Behind the menus, bugs only fidget.
    if (!game.playing) return;
    position
      ..y += game.session.speed * dt
      ..x += sin(_time * 3 + phase) * 30 * dt;
    if (position.y > game.buildLine) game.escaped(this);
  }

  @override
  void render(Canvas canvas) {
    final w = size.x;
    final h = size.y;
    final step = sin(_time * 14 + phase) * 3;
    // Three legs a side, alternating.
    for (var i = 0; i < 3; i++) {
      final y = h * (0.4 + i * 0.18);
      final s = i.isEven ? step : -step;
      canvas
        ..drawLine(Offset(w * 0.3, y), Offset(0, y + s), _legs)
        ..drawLine(Offset(w * 0.7, y), Offset(w, y - s), _legs);
    }
    // Antennae, head, then a shell split down the middle.
    canvas
      ..drawLine(Offset(w * 0.42, h * 0.16), Offset(w * 0.3, 0), _legs)
      ..drawLine(Offset(w * 0.58, h * 0.16), Offset(w * 0.7, 0), _legs)
      ..drawCircle(Offset(w / 2, h * 0.22), w * 0.2, _body)
      ..drawOval(Rect.fromLTWH(w * 0.18, h * 0.3, w * 0.64, h * 0.66), _shell)
      ..drawLine(
        Offset(w / 2, h * 0.32),
        Offset(w / 2, h * 0.94),
        Paint()
          ..color = DemoColors.background
          ..strokeWidth = 1.5,
      );
  }

  @override
  void onTapDown(TapDownEvent event) => game.squash(this);
}

/// The hot-reload orb: tap it to freeze every bug for a few seconds.
class Orb extends PositionComponent
    with TapCallbacks, HasGameReference<HotReloadGame> {
  Orb({required super.position})
    : super(size: Vector2.all(44), anchor: Anchor.center);

  var _time = 0.0;

  @override
  void update(double dt) {
    _time += dt;
    position.y += 40 * dt;
    if (position.y > game.buildLine) removeFromParent();
  }

  @override
  void render(Canvas canvas) {
    final c = Offset(size.x / 2, size.y / 2);
    final pulse = 1 + sin(_time * 6) * 0.08;
    canvas
      ..drawCircle(
        c,
        size.x / 2 * pulse,
        Paint()..color = DemoColors.mint.withValues(alpha: 0.25),
      )
      ..drawCircle(c, size.x * 0.32, Paint()..color = DemoColors.mint);
    // A lightning bolt.
    final s = size.x;
    canvas.drawPath(
      Path()
        ..moveTo(s * 0.55, s * 0.26)
        ..lineTo(s * 0.38, s * 0.52)
        ..lineTo(s * 0.5, s * 0.52)
        ..lineTo(s * 0.44, s * 0.74)
        ..lineTo(s * 0.62, s * 0.46)
        ..lineTo(s * 0.5, s * 0.46)
        ..close(),
      Paint()..color = DemoColors.background,
    );
  }

  @override
  void onTapDown(TapDownEvent event) => game.collectOrb(this);
}

/// A burst where a bug was squashed.
ParticleSystemComponent splat(Vector2 at, Random random) {
  return ParticleSystemComponent(
    position: at,
    particle: Particle.generate(
      count: 14,
      lifespan: 0.5,
      generator: (i) => AcceleratedParticle(
        speed:
            Vector2(random.nextDouble() - 0.5, random.nextDouble() - 0.5) * 320,
        acceleration: Vector2(0, 400),
        child: CircleParticle(
          radius: 1.5 + random.nextDouble() * 2.5,
          paint: Paint()..color = i.isEven ? DemoColors.coral : DemoColors.mint,
        ),
      ),
    ),
  );
}

/// The grid behind the play area and the build line the bugs must not reach.
class Board extends Component with HasGameReference<HotReloadGame> {
  static final _grid = Paint()..color = const Color(0xFF151923);

  @override
  void render(Canvas canvas) {
    final size = game.size;
    for (var x = 0.0; x < size.x; x += 32) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.y), _grid);
    }
    for (var y = 0.0; y < size.y; y += 32) {
      canvas.drawLine(Offset(0, y), Offset(size.x, y), _grid);
    }
    final line = game.buildLine;
    canvas
      ..drawRect(
        Rect.fromLTRB(0, line, size.x, size.y),
        Paint()..color = DemoColors.surface,
      )
      ..drawLine(
        Offset(0, line),
        Offset(size.x, line),
        Paint()
          ..color = game.session.frozen ? DemoColors.mint : DemoColors.line
          ..strokeWidth = 2,
      );
    // Lives, right-aligned in the bar: filled while left, outlined once lost.
    for (var i = 0; i < Session.startLives; i++) {
      final c = Offset(size.x - 24 - i * 22, line + (size.y - line) / 2);
      canvas.drawCircle(
        c,
        6,
        Paint()
          ..color = DemoColors.coral
          ..style = i < game.session.lives
              ? PaintingStyle.fill
              : PaintingStyle.stroke
          ..strokeWidth = 1.5,
      );
    }
  }
}
