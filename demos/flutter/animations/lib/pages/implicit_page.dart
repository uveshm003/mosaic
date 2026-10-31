import 'package:demo_kit/demo_kit.dart';
import 'package:flutter/material.dart';

/// Implicit animations: change a value, and the widget animates to it.
class ImplicitPage extends StatefulWidget {
  const ImplicitPage({super.key});

  @override
  State<ImplicitPage> createState() => _ImplicitPageState();
}

const _swatches = <String, Color>{
  'mint': DemoColors.mint,
  'coral': DemoColors.coral,
  'violet': Color(0xFFA78BFA),
  'amber': Color(0xFFFBBF24),
};

class _ImplicitPageState extends State<ImplicitPage> {
  var _radius = 16.0;
  var _big = false;
  var _alignEnd = false;
  var _swatch = 'mint';
  var _count = 0;

  @override
  Widget build(BuildContext context) {
    final text = Theme.of(context).textTheme;
    final size = _big ? 160.0 : 96.0;
    final align = _alignEnd ? 'Alignment.centerRight' : 'Alignment.centerLeft';
    return PageBody(
      children: [
        Text('Implicit animations', style: text.headlineSmall),
        const SizedBox(height: 4),
        Text(
          'No controller: set new values in setState and the widget animates to them.',
          style: text.bodyMedium?.copyWith(color: DemoColors.muted),
        ),
        const SizedBox(height: 16),
        Card(
          child: SizedBox(
            height: 220,
            child: AnimatedAlign(
              duration: const Duration(milliseconds: 600),
              curve: Curves.easeInOutCubicEmphasized,
              alignment: _alignEnd
                  ? Alignment.centerRight
                  : Alignment.centerLeft,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: AnimatedContainer(
                  key: const Key('box'),
                  duration: const Duration(milliseconds: 600),
                  curve: Curves.easeInOutCubicEmphasized,
                  width: size,
                  height: size,
                  decoration: BoxDecoration(
                    color: _swatches[_swatch],
                    borderRadius: BorderRadius.circular(_radius),
                  ),
                  alignment: Alignment.center,
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 300),
                    transitionBuilder: (child, animation) => ScaleTransition(
                      scale: animation,
                      child: FadeTransition(opacity: animation, child: child),
                    ),
                    child: Text(
                      '$_count',
                      key: ValueKey(_count),
                      style: text.headlineMedium?.copyWith(
                        color: DemoColors.background,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            const Text('Corner radius'),
            Expanded(
              child: Slider(
                key: const Key('radius'),
                max: 80,
                divisions: 16,
                value: _radius,
                label: '${_radius.round()}',
                onChanged: (v) => setState(() => _radius = v),
              ),
            ),
          ],
        ),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            for (final name in _swatches.keys)
              ChoiceChip(
                label: Text(name),
                selected: name == _swatch,
                onSelected: (_) => setState(() => _swatch = name),
              ),
            FilterChip(
              label: const Text('big'),
              selected: _big,
              onSelected: (v) => setState(() => _big = v),
            ),
            FilterChip(
              label: const Text('move right'),
              selected: _alignEnd,
              onSelected: (v) => setState(() => _alignEnd = v),
            ),
            FilledButton.icon(
              onPressed: () => setState(() => _count++),
              icon: const Icon(Icons.add),
              label: const Text('Count'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        CodeBlock(
          'AnimatedAlign(\n'
          '  alignment: $align,\n'
          '  child: AnimatedContainer(\n'
          '    duration: const Duration(milliseconds: 600),\n'
          '    width: ${size.round()}, height: ${size.round()},\n'
          '    decoration: BoxDecoration(\n'
          '      color: ${_swatch[0].toUpperCase()}${_swatch.substring(1)},\n'
          '      borderRadius: BorderRadius.circular(${_radius.round()}),\n'
          '    ),\n'
          '    child: AnimatedSwitcher(child: Text(\'$_count\')),\n'
          '  ),\n'
          ')',
        ),
      ],
    );
  }
}
