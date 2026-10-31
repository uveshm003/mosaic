import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

/// The curves worth knowing, by the name you'd type in Dart.
const namedCurves = <String, Curve>{
  'easeInOutCubicEmphasized': Curves.easeInOutCubicEmphasized,
  'fastOutSlowIn': Curves.fastOutSlowIn,
  'easeOutBack': Curves.easeOutBack,
  'elasticOut': Curves.elasticOut,
  'bounceOut': Curves.bounceOut,
  'decelerate': Curves.decelerate,
  'linear': Curves.linear,
};

class CurvesPage extends StatefulWidget {
  const CurvesPage({super.key});

  @override
  State<CurvesPage> createState() => _CurvesPageState();
}

class _CurvesPageState extends State<CurvesPage>
    with SingleTickerProviderStateMixin {
  late final _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1200),
  )..repeat(reverse: true);
  var _name = namedCurves.keys.first;

  Curve get _curve => namedCurves[_name]!;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final ms = _controller.duration!.inMilliseconds;
    return PageBody(
      children: [
        Text('Curves', style: text.headlineSmall),
        const SizedBox(height: 4),
        Text(
          'The same motion with a different curve feels like a different app.',
          style: text.bodyMedium?.copyWith(color: DemoColors.muted),
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            for (final name in namedCurves.keys)
              ChoiceChip(
                label: Text(name),
                selected: name == _name,
                onSelected: (_) => setState(() => _name = name),
              ),
          ],
        ),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: AnimatedBuilder(
              animation: _controller,
              builder: (context, _) {
                final t = _controller.value;
                return Column(
                  children: [
                    SizedBox(
                      height: 180,
                      width: double.infinity,
                      child: CustomPaint(
                        painter: CurvePainter(curve: _curve, progress: t),
                      ),
                    ),
                    const SizedBox(height: 16),
                    // The ball runs the curve; values past 1 overshoot the track.
                    LayoutBuilder(
                      builder: (context, box) => SizedBox(
                        height: 32,
                        child: Stack(
                          clipBehavior: Clip.none,
                          children: [
                            Positioned.fill(
                              child: Center(
                                child: Container(
                                  height: 2,
                                  color: DemoColors.line,
                                ),
                              ),
                            ),
                            Positioned(
                              left: (box.maxWidth - 32) * _curve.transform(t),
                              child: const CircleAvatar(
                                radius: 16,
                                backgroundColor: DemoColors.coral,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            const Text('Duration'),
            Expanded(
              child: Slider(
                min: 300,
                max: 3000,
                divisions: 27,
                value: ms.toDouble(),
                label: '$ms ms',
                onChanged: (value) => setState(() {
                  _controller
                    ..duration = Duration(milliseconds: value.round())
                    ..repeat(reverse: true);
                }),
              ),
            ),
            SizedBox(width: 64, child: Text('$ms ms')),
          ],
        ),
        const SizedBox(height: 8),
        CodeBlock(
          'final animation = CurvedAnimation(\n'
          '  parent: controller, // ${ms}ms, repeat(reverse: true)\n'
          '  curve: Curves.$_name,\n'
          ');',
        ),
      ],
    );
  }
}

/// Plots a curve over time, with a dot at the current progress.
class CurvePainter extends CustomPainter {
  CurvePainter({required this.curve, required this.progress});

  final Curve curve;
  final double progress;

  @override
  void paint(Canvas canvas, Size size) {
    // Leave headroom: elastic and back curves overshoot 0..1.
    const pad = 0.2;
    Offset at(double t) {
      final v = curve.transform(t);
      return Offset(
        t * size.width,
        size.height * (1 - (v + pad) / (1 + 2 * pad)),
      );
    }

    // Guides at 0 and 1, so overshoot reads at a glance.
    final grid = Paint()
      ..color = DemoColors.line
      ..strokeWidth = 1;
    for (final v in [0.0, 1.0]) {
      final y = size.height * (1 - (v + pad) / (1 + 2 * pad));
      canvas.drawLine(Offset(0, y), Offset(size.width, y), grid);
    }

    final path = Path()..moveTo(at(0).dx, at(0).dy);
    for (var i = 1; i <= 120; i++) {
      final p = at(i / 120);
      path.lineTo(p.dx, p.dy);
    }
    canvas.drawPath(
      path,
      Paint()
        ..color = DemoColors.mint
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.5,
    );
    canvas.drawCircle(at(progress), 6, Paint()..color = DemoColors.coral);
  }

  @override
  bool shouldRepaint(CurvePainter old) =>
      old.curve != curve || old.progress != progress;
}
