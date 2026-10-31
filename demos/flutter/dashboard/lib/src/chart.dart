import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

/// A line of readings over a shaded band of the normal range. [compact] drops the
/// band labels for use as a sparkline.
class LineChart extends StatelessWidget {
  const LineChart({
    super.key,
    required this.values,
    required this.low,
    required this.high,
    this.compact = false,
  });

  final List<double> values;
  final double low;
  final double high;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _LinePainter(values, low, high, compact),
      size: Size.infinite,
    );
  }
}

class _LinePainter extends CustomPainter {
  _LinePainter(this.values, this.low, this.high, this.compact);

  final List<double> values;
  final double low;
  final double high;
  final bool compact;

  @override
  void paint(Canvas canvas, Size size) {
    if (values.length < 2) return;
    // Scale to the data and the range together, with a little headroom.
    final lo = [low, ...values].reduce((a, b) => a < b ? a : b) - 2;
    final hi = [high, ...values].reduce((a, b) => a > b ? a : b) + 2;
    double y(double v) => size.height * (1 - (v - lo) / (hi - lo));
    final dx = size.width / (values.length - 1);

    canvas.drawRect(
      Rect.fromLTRB(0, y(high), size.width, y(low)),
      Paint()..color = DemoColors.mint.withValues(alpha: 0.06),
    );
    if (!compact) {
      final dash = Paint()
        ..color = DemoColors.line
        ..strokeWidth = 1;
      for (final v in [low, high]) {
        canvas.drawLine(Offset(0, y(v)), Offset(size.width, y(v)), dash);
        final label = TextPainter(
          text: TextSpan(
            text: v.toStringAsFixed(0),
            style: const TextStyle(fontSize: 11, color: DemoColors.muted),
          ),
          textDirection: TextDirection.ltr,
        )..layout();
        label.paint(canvas, Offset(4, y(v) - label.height - 2));
      }
    }

    final path = Path()..moveTo(0, y(values.first));
    for (var i = 1; i < values.length; i++) {
      path.lineTo(i * dx, y(values[i]));
    }
    canvas.drawPath(
      path,
      Paint()
        ..color = DemoColors.mint
        ..style = PaintingStyle.stroke
        ..strokeWidth = compact ? 1.5 : 2
        ..strokeJoin = StrokeJoin.round,
    );
    // Out-of-range points in coral.
    for (var i = 0; i < values.length; i++) {
      final v = values[i];
      if (v < low || v > high) {
        canvas.drawCircle(
          Offset(i * dx, y(v)),
          compact ? 2 : 3.5,
          Paint()..color = DemoColors.coral,
        );
      }
    }
  }

  @override
  bool shouldRepaint(_LinePainter old) => true;
}
